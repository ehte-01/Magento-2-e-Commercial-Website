<?php
namespace Razorpay\Magento\Model\Resolver\PlaceRazorpayOrder;

/**
 * Interceptor class for @see \Razorpay\Magento\Model\Resolver\PlaceRazorpayOrder
 */
class Interceptor extends \Razorpay\Magento\Model\Resolver\PlaceRazorpayOrder implements \Magento\Framework\Interception\InterceptorInterface
{
    use \Magento\Framework\Interception\Interceptor;

    public function __construct(\Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig, \Magento\QuoteGraphQl\Model\Cart\GetCartForUser $getCartForUser, \Magento\Quote\Api\CartManagementInterface $cartManagement, \Razorpay\Magento\Model\PaymentMethod $paymentMethod, \Magento\Sales\Api\Data\OrderInterface $order, \Psr\Log\LoggerInterface $logger, \Razorpay\Magento\Model\Config $config, \Razorpay\Magento\Model\TrackPluginInstrumentation $trackPluginInstrumentation)
    {
        $this->___init();
        parent::__construct($scopeConfig, $getCartForUser, $cartManagement, $paymentMethod, $order, $logger, $config, $trackPluginInstrumentation);
    }

    /**
     * {@inheritdoc}
     */
    public function resolve(\Magento\Framework\GraphQl\Config\Element\Field $field, $context, \Magento\Framework\GraphQl\Schema\Type\ResolveInfo $info, ?array $value = null, ?array $args = null)
    {
        $pluginInfo = $this->pluginList->getNext($this->subjectType, 'resolve');
        return $pluginInfo ? $this->___callPlugins('resolve', func_get_args(), $pluginInfo) : parent::resolve($field, $context, $info, $value, $args);
    }
}
