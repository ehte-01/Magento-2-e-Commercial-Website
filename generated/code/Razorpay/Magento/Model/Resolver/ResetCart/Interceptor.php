<?php
namespace Razorpay\Magento\Model\Resolver\ResetCart;

/**
 * Interceptor class for @see \Razorpay\Magento\Model\Resolver\ResetCart
 */
class Interceptor extends \Razorpay\Magento\Model\Resolver\ResetCart implements \Magento\Framework\Interception\InterceptorInterface
{
    use \Magento\Framework\Interception\Interceptor;

    public function __construct(\Psr\Log\LoggerInterface $logger, \Magento\Framework\Api\SearchCriteriaBuilder $searchCriteriaBuilder, \Magento\Sales\Api\OrderRepositoryInterface $orderRepository, \Razorpay\Magento\Model\TrackPluginInstrumentation $trackPluginInstrumentation)
    {
        $this->___init();
        parent::__construct($logger, $searchCriteriaBuilder, $orderRepository, $trackPluginInstrumentation);
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
